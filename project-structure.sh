#!/bin/bash

# Project Structure Generator
# Outputs hierarchical file structure while ignoring common temporary and dependency files

print_structure() {
    local path="$1"
    local prefix="$2"
    local is_last="$3"
    
    # Get basename of current path
    local name=$(basename "$path")
    
    # Print current item
    if [ "$prefix" = "" ]; then
        echo "$name"
    else
        if [ "$is_last" = true ]; then
            echo "${prefix}└── $name"
        else
            echo "${prefix}├── $name"
        fi
    fi
    
    # If it's a directory, process its contents
    if [ -d "$path" ]; then
        # Get all items in directory, excluding filtered items
        local items=()
        while IFS= read -r -d '' item; do
            items+=("$item")
        done < <(find "$path" -maxdepth 1 -type f -o -type d | \
                grep -v "^$path$" | \
                grep -vE '\.(git|DS_Store|log|tmp|temp|cache)(/|$)' | \
                grep -vE '(node_modules|\.git|dist|build|coverage|\.nyc_output)(/|$)' | \
                grep -vE '\.(lock|pid|swp|swo|bak|backup)$' | \
                grep -vE '\~$' | \
                grep -vE '^\.' | \
                sort -f | \
                tr '\n' '\0')
        
        # Process each item
        local count=${#items[@]}
        for ((i=0; i<count; i++)); do
            local item="${items[i]}"
            local item_name=$(basename "$item")
            local is_item_last=false
            
            # Check if this is the last item
            if [ $((i+1)) -eq $count ]; then
                is_item_last=true
            fi
            
            # Set new prefix for recursive call
            local new_prefix
            if [ "$prefix" = "" ]; then
                new_prefix=""
            else
                if [ "$is_last" = true ]; then
                    new_prefix="${prefix}    "
                else
                    new_prefix="${prefix}│   "
                fi
            fi
            
            # Recursive call
            print_structure "$item" "$new_prefix" "$is_item_last"
        done
    fi
}

# Alternative simpler version using tree command if available
print_with_tree() {
    if command -v tree &> /dev/null; then
        tree -I 'node_modules|.git|dist|build|coverage|.nyc_output|*.log|*.tmp|*.temp|*.cache|*.lock|*.pid|*.swp|*.swo|*.bak|*.backup|*~|.DS_Store' -a
    else
        echo "Tree command not available. Using custom implementation..."
        print_structure "." "" true
    fi
}

# Enhanced version with file filtering
print_filtered_structure() {
    echo "$(basename $(pwd))"
    find . -type f -o -type d | \
    grep -vE '\./\.' | \
    grep -vE '(node_modules|\.git|dist|build|coverage|\.nyc_output)' | \
    grep -vE '\.(log|tmp|temp|cache|lock|pid|swp|swo|bak|backup)$' | \
    grep -vE '\~$' | \
    grep -v '^.$' | \
    sort | \
    sed 's|^\./||' | \
    sed 's|/| |g' | \
    awk '{
        depth = NF - 1
        for (i = 0; i < depth; i++) {
            printf "│   "
        }
        if (depth > 0) printf "├── "
        print $NF
    }' | \
    sed '$s/├──/└──/'
}

# Main execution
echo "PROJECT STRUCTURE"
echo "=================="
echo ""

# Check for arguments
case "${1:-auto}" in
    "tree")
        print_with_tree
        ;;
    "custom")
        print_structure "." "" true
        ;;
    "simple")
        print_filtered_structure
        ;;
    "auto"|*)
        if command -v tree &> /dev/null; then
            print_with_tree
        else
            print_filtered_structure
        fi
        ;;
esac