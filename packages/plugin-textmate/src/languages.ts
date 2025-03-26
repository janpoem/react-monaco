const tmLanguages =
  ';yaml;yaml-embedded;yaml-1.3;yaml-1.2;yaml-1.1;yaml-1.0;xsl;xml;asp-vb-net;typescriptreact;typescript;jsdoc.ts.injection;jsdoc.js.injection;sql;swift;shell-unix-bash;shaderlab;searchresult;scss;sassdoc;ruby;rust;cshtml;pug;rst;magicregexp;magicpython;r;powershell;php;html;md-math;md-math-inline;md-math-fence;md-math-block;make;log;objective-c;objective-c++;less;lua;perl6;perl;tex;markdown-latex-combined;latex;cpp-grammar-bailout;bibtex;markdown;html;html-derivative;ini;java;javascriptreact;javascript;handlebars;hlsl;snippets;jsonl;jsonc;json;fsharp;ignore;git-rebase;git-commit;go;diff;docker;groovy;julia;dart;csharp;css;batchfile;coffeescript;clojure;platform;cuda-cpp;cpp;cpp.embedded.macro;c;dbml;kotlin;';

export const isTmSupportLanguage = (id: string) =>
  tmLanguages.includes(`;${id};`);
