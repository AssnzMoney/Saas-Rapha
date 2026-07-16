import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src/app/admin', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    const regex = /const\s+\{\s*data\s*:\s*profile\s*(?:,\s*error\s*:\s*[^}]+)?\}\s*=\s*await\s+supabase\s*\n?\s*\.from\('profiles'\)[\s\S]*?\.eq\('user_id',\s*user\.id\)\s*\.single\(\)/g;
    const regex2 = /const\s+\{\s*data\s*:\s*profile\s*(?:,\s*error\s*:\s*[^}]+)?\}\s*=\s*await\s+supabase\s*\.from\('profiles'\)[\s\S]*?\.eq\('user_id',\s*user\.id\)\s*\.single\(\)/g;
    
    // Also consider cases without const { data: profile } like maybe just fetching profile
    
    content = content.replace(regex, (match) => {
       let replaced = match.replace('const { data: profile }', 'const { data: profiles }');
       replaced = replaced.replace('.single()', '.limit(1)');
       return replaced + '\n  const profile = profiles?.[0]';
    });
    
    content = content.replace(regex2, (match) => {
       let replaced = match.replace('const { data: profile }', 'const { data: profiles }');
       replaced = replaced.replace('.single()', '.limit(1)');
       return replaced + '\n  const profile = profiles?.[0]';
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
