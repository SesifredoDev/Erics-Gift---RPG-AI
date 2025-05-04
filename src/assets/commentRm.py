import sys
import re

def remove_js_comments(file_path, output_path):
    def clean_line(line):
        in_string = False
        new_line = ""
        i = 0
        while i < len(line):
            if line[i] == '"' and (i == 0 or line[i-1] != '\\'):
                in_string = not in_string
                new_line += line[i]
            elif not in_string and line[i:i+2] == "//":
                break  # remove comment
            else:
                new_line += line[i]
            i += 1
        return new_line

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    cleaned_lines = [clean_line(line) for line in lines]

    with open(output_path, 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)

    print(f"Comments removed. Cleaned file saved to: {output_path}")

# Usage
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python remove_js_comments.py input.json output.json")
    else:
        remove_js_comments(sys.argv[1], sys.argv[2])