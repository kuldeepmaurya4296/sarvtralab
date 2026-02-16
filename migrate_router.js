const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                filelist = walkSync(filepath, filelist);
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                filelist.push(filepath);
            }
        }
    });
    return filelist;
};

const componentsFiles = walkSync('components');
const appFiles = walkSync('app');
const allFiles = [...componentsFiles, ...appFiles];

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    if (content.includes('react-router-dom')) {
        console.log(`Processing ${file}...`);

        // Replace Link import
        // Check if Link is imported individually or with others
        // Simple case: import { Link } from 'react-router-dom';
        // Complex case: import { Link, useNavigate } from 'react-router-dom';

        // 1. Handle Link
        if (content.match(/import\s*{[^}]*Link[^}]*}\s*from\s*['"]react-router-dom['"]/)) {
            // Remove Link from matched import
            content = content.replace(/(import\s*{[^}]*)(\bLink,?\s*)([^}]*}\s*from\s*['"]react-router-dom['"])/, '$1$3');
            content = content.replace(/(import\s*{[^}]*)(\s*,\s*Link\b)([^}]*}\s*from\s*['"]react-router-dom['"])/, '$1$3');
            // If empty brackets, remove line? We will handle useNavigate separately.

            // Add next/link import
            if (!content.includes("import Link from 'next/link'")) {
                content = `import Link from 'next/link';\n` + content;
            }
        }

        // 2. Handle useNavigate -> useRouter
        if (content.includes('useNavigate')) {
            // Remove useNavigate from import
            content = content.replace(/(import\s*{[^}]*)(\buseNavigate,?\s*)([^}]*}\s*from\s*['"]react-router-dom['"])/, '$1$3');
            content = content.replace(/(import\s*{[^}]*)(\s*,\s*useNavigate\b)([^}]*}\s*from\s*['"]react-router-dom['"])/, '$1$3');

            // Add next/navigation import
            if (!content.includes("import { useRouter")) {
                // Check if existing next/navigation import
                if (content.includes("from 'next/navigation'")) {
                    content = content.replace(/import\s*{([^}]*)}\s*from\s*['"]next\/navigation['"]/, "import { $1, useRouter } from 'next/navigation'");
                } else {
                    content = `import { useRouter } from 'next/navigation';\n` + content;
                }
            }

            // Replace usages
            content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();');
            content = content.replace(/navigate\(/g, 'router.push(');
        }

        // 3. Handle useLocation -> usePathname
        if (content.includes('useLocation')) {
            content = content.replace(/(import\s*{[^}]*)(\buseLocation,?\s*)([^}]*}\s*from\s*['"]react-router-dom['"])/, '$1$3');
            content = content.replace(/(import\s*{[^}]*)(\s*,\s*useLocation\b)([^}]*}\s*from\s*['"]react-router-dom['"])/, '$1$3');

            if (!content.includes("import { usePathname")) {
                if (content.includes("from 'next/navigation'")) {
                    content = content.replace(/import\s*{([^}]*)}\s*from\s*['"]next\/navigation['"]/, "import { $1, usePathname } from 'next/navigation'");
                } else {
                    content = `import { usePathname } from 'next/navigation';\n` + content;
                }
            }
            content = content.replace(/const\s+location\s*=\s*useLocation\(\);?/g, 'const pathname = usePathname();');
            content = content.replace(/location\.pathname/g, 'pathname');
        }

        // 4. Handle useParams
        if (content.includes('useParams')) {
            // useParams is also in next/navigation
            content = content.replace(/(import\s*{[^}]*)(\buseParams,?\s*)([^}]*}\s*from\s*['"]react-router-dom['"])/, '$1$3');
            content = content.replace(/(import\s*{[^}]*)(\s*,\s*useParams\b)([^}]*}\s*from\s*['"]react-router-dom['"])/, '$1$3');

            if (!content.includes("import { useParams")) {
                if (content.includes("from 'next/navigation'")) {
                    content = content.replace(/import\s*{([^}]*)}\s*from\s*['"]next\/navigation['"]/, "import { $1, useParams } from 'next/navigation'");
                } else {
                    content = `import { useParams } from 'next/navigation';\n` + content;
                }
            }
        }

        // Cleanup empty imports from react-router-dom
        content = content.replace(/import\s*{\s*}\s*from\s*['"]react-router-dom['"];?\n?/g, '');

        // Replace Link to prop
        content = content.replace(/<Link\s+([^>]*)\bto=/g, '<Link $1href=');

        // Ensure 'use client' if hooks are used
        if ((content.includes('useRouter') || content.includes('usePathname') || content.includes('useParams')) && !content.includes("'use client'")) {
            content = `'use client';\n` + content;
        }
    }

    // Also fix image imports using @/assets if necessary, 
    // but let's stick to router fix first.

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
