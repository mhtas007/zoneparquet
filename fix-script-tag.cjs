const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

if(!content.includes('})();\r\n    </script>\r\n    <!-- B2B Partner Form Modal -->') && 
   !content.includes('})();\n    </script>\n    <!-- B2B Partner Form Modal -->')) {
    
    content = content.replace('        })();\r\n    <!-- B2B Partner Form Modal -->', '        })();\n    </script>\n    <!-- B2B Partner Form Modal -->');
    content = content.replace('        })();\n    <!-- B2B Partner Form Modal -->', '        })();\n    </script>\n    <!-- B2B Partner Form Modal -->');
    
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Fixed missing script tag!');
} else {
    console.log('Script tag already exists!');
}
