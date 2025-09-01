#!/bin/bash
# Container Security Scanning Script
# Performs comprehensive security analysis of Docker images

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCAN_REPORTS_DIR="./docker/security/reports"
TRIVY_CACHE_DIR="./docker/security/.trivy-cache"
SEVERITY_LEVELS="HIGH,CRITICAL"
IMAGE_NAME="${1:-oc_app}"
DOCKERFILE_PATH="${2:-./Dockerfile}"

# Create directories
mkdir -p "$SCAN_REPORTS_DIR" "$TRIVY_CACHE_DIR"

echo -e "${BLUE}🔒 OctoCode Container Security Scanner${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Trivy if not present
install_trivy() {
    echo -e "${YELLOW}📦 Installing Trivy security scanner...${NC}"
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command_exists curl; then
            curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
        else
            echo -e "${RED}❌ curl not found. Please install curl or Trivy manually.${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install trivy
        else
            echo -e "${RED}❌ Homebrew not found. Please install Trivy manually.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Unsupported OS. Please install Trivy manually.${NC}"
        exit 1
    fi
}

# Function to run Dockerfile security scan
scan_dockerfile() {
    echo -e "${BLUE}🔍 Scanning Dockerfile for security issues...${NC}"
    
    local report_file="$SCAN_REPORTS_DIR/dockerfile-scan-$(date +%Y%m%d-%H%M%S).json"
    
    if trivy config --format json --output "$report_file" "$DOCKERFILE_PATH"; then
        echo -e "${GREEN}✅ Dockerfile scan completed${NC}"
        
        # Generate human-readable report
        trivy config --format table "$DOCKERFILE_PATH" > "$SCAN_REPORTS_DIR/dockerfile-report.txt"
        
        # Check for high/critical issues
        local issues=$(jq -r '.Results[]?.Misconfigurations[]? | select(.Severity == "HIGH" or .Severity == "CRITICAL") | .ID' "$report_file" 2>/dev/null | wc -l || echo "0")
        
        if [[ $issues -gt 0 ]]; then
            echo -e "${RED}⚠️  Found $issues high/critical Dockerfile security issues${NC}"
            return 1
        else
            echo -e "${GREEN}✅ No high/critical Dockerfile security issues found${NC}"
            return 0
        fi
    else
        echo -e "${RED}❌ Dockerfile scan failed${NC}"
        return 1
    fi
}

# Function to run image vulnerability scan
scan_image() {
    local image="$1"
    echo -e "${BLUE}🔍 Scanning image '$image' for vulnerabilities...${NC}"
    
    local report_file="$SCAN_REPORTS_DIR/image-scan-$(date +%Y%m%d-%H%M%S).json"
    
    if trivy image --format json --output "$report_file" --severity "$SEVERITY_LEVELS" "$image"; then
        echo -e "${GREEN}✅ Image vulnerability scan completed${NC}"
        
        # Generate human-readable report
        trivy image --format table --severity "$SEVERITY_LEVELS" "$image" > "$SCAN_REPORTS_DIR/image-vulnerabilities.txt"
        
        # Count vulnerabilities
        local vulns=$(jq -r '.Results[]?.Vulnerabilities[]? | select(.Severity == "HIGH" or .Severity == "CRITICAL") | .VulnerabilityID' "$report_file" 2>/dev/null | wc -l || echo "0")
        
        if [[ $vulns -gt 0 ]]; then
            echo -e "${RED}⚠️  Found $vulns high/critical vulnerabilities${NC}"
            return 1
        else
            echo -e "${GREEN}✅ No high/critical vulnerabilities found${NC}"
            return 0
        fi
    else
        echo -e "${RED}❌ Image vulnerability scan failed${NC}"
        return 1
    fi
}

# Function to scan for secrets
scan_secrets() {
    echo -e "${BLUE}🔍 Scanning for exposed secrets...${NC}"
    
    local report_file="$SCAN_REPORTS_DIR/secrets-scan-$(date +%Y%m%d-%H%M%S).json"
    
    if trivy fs --scanners secret --format json --output "$report_file" .; then
        echo -e "${GREEN}✅ Secret scan completed${NC}"
        
        # Generate human-readable report
        trivy fs --scanners secret --format table . > "$SCAN_REPORTS_DIR/secrets-report.txt"
        
        # Check for secrets
        local secrets=$(jq -r '.Results[]?.Secrets[]? | .RuleID' "$report_file" 2>/dev/null | wc -l || echo "0")
        
        if [[ $secrets -gt 0 ]]; then
            echo -e "${RED}⚠️  Found $secrets potential secrets${NC}"
            echo -e "${YELLOW}📋 Check $SCAN_REPORTS_DIR/secrets-report.txt for details${NC}"
            return 1
        else
            echo -e "${GREEN}✅ No secrets detected${NC}"
            return 0
        fi
    else
        echo -e "${RED}❌ Secret scan failed${NC}"
        return 1
    fi
}

# Function to generate security report
generate_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local report_file="$SCAN_REPORTS_DIR/security-summary-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# OctoCode Security Scan Report

**Scan Date:** $timestamp  
**Image:** $IMAGE_NAME  
**Dockerfile:** $DOCKERFILE_PATH  

## Summary

- **Dockerfile Security:** $(cat "$SCAN_REPORTS_DIR/dockerfile-report.txt" | grep -E "(HIGH|CRITICAL)" | wc -l) high/critical issues
- **Image Vulnerabilities:** $(cat "$SCAN_REPORTS_DIR/image-vulnerabilities.txt" | grep -E "(HIGH|CRITICAL)" | wc -l) high/critical vulnerabilities  
- **Secret Detection:** $(cat "$SCAN_REPORTS_DIR/secrets-report.txt" | grep -v "^$" | wc -l) potential secrets

## Recommendations

1. **Dockerfile Security:**
   - Use specific version tags instead of 'latest'
   - Run containers as non-root user
   - Minimize installed packages
   - Use multi-stage builds to reduce attack surface

2. **Vulnerability Management:**
   - Keep base images updated
   - Regularly scan for new vulnerabilities
   - Apply security patches promptly
   - Consider using distroless images

3. **Secret Management:**
   - Never embed secrets in images
   - Use Docker secrets or external secret managers
   - Implement secret scanning in CI/CD pipeline
   - Regular secret rotation

## Files Generated

- \`dockerfile-report.txt\` - Dockerfile security issues
- \`image-vulnerabilities.txt\` - Container vulnerabilities  
- \`secrets-report.txt\` - Secret detection results
- JSON reports for automated processing

EOF

    echo -e "${GREEN}📊 Security report generated: $report_file${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting security scan for $IMAGE_NAME...${NC}"
    echo ""
    
    # Check if Trivy is installed
    if ! command_exists trivy; then
        install_trivy
    fi
    
    # Initialize scan results
    local dockerfile_result=0
    local image_result=0
    local secrets_result=0
    
    # Run scans
    scan_dockerfile || dockerfile_result=1
    echo ""
    
    # Only scan image if it exists
    if docker image inspect "$IMAGE_NAME" >/dev/null 2>&1; then
        scan_image "$IMAGE_NAME" || image_result=1
    else
        echo -e "${YELLOW}⚠️  Image '$IMAGE_NAME' not found locally. Building first...${NC}"
        if docker build -t "$IMAGE_NAME" .; then
            scan_image "$IMAGE_NAME" || image_result=1
        else
            echo -e "${RED}❌ Failed to build image${NC}"
            image_result=1
        fi
    fi
    echo ""
    
    scan_secrets || secrets_result=1
    echo ""
    
    # Generate comprehensive report
    generate_report
    
    # Summary
    echo -e "${BLUE}📊 Security Scan Summary${NC}"
    echo -e "${BLUE}========================${NC}"
    
    if [[ $dockerfile_result -eq 0 ]]; then
        echo -e "${GREEN}✅ Dockerfile: Secure${NC}"
    else
        echo -e "${RED}❌ Dockerfile: Issues found${NC}"
    fi
    
    if [[ $image_result -eq 0 ]]; then
        echo -e "${GREEN}✅ Image: No critical vulnerabilities${NC}"
    else
        echo -e "${RED}❌ Image: Vulnerabilities found${NC}"
    fi
    
    if [[ $secrets_result -eq 0 ]]; then
        echo -e "${GREEN}✅ Secrets: None detected${NC}"
    else
        echo -e "${RED}❌ Secrets: Potential leaks found${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}📂 Reports available in: $SCAN_REPORTS_DIR${NC}"
    
    # Exit with error if any scan failed
    if [[ $dockerfile_result -ne 0 || $image_result -ne 0 || $secrets_result -ne 0 ]]; then
        echo -e "${RED}❌ Security scan completed with issues${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ All security scans passed${NC}"
        exit 0
    fi
}

# Handle script arguments
if [[ $# -eq 0 ]]; then
    echo "Usage: $0 [image_name] [dockerfile_path]"
    echo "Example: $0 oc_app ./Dockerfile"
    echo ""
    echo "Using default values..."
fi

# Run main function
main "$@"