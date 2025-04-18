import type { MonacoCustomTheme } from '../types';

export default {
  name: 'hc-light',
  displayName: 'Light High Contrast',
  isDark: false,
  colors: {},
  data: {
    inherit: false,
    base: 'hc-light',
    colors: {
      'actionBar.toggledBackground': '#dddddd',
      'statusBarItem.remoteBackground': '#FFFFFF',
      'statusBarItem.remoteForeground': '#000000',
    },
    rules: [
      {
        foreground: '#292929',
        token: 'meta.embedded',
      },
      {
        foreground: '#292929',
        token: 'source.groovy.embedded',
      },
      {
        foreground: '#292929',
        token: 'variable.legacy.builtin.python',
      },
      {
        fontStyle: 'italic',
        token: 'emphasis',
      },
      {
        fontStyle: 'bold',
        token: 'strong',
      },
      {
        foreground: '#062F4A',
        token: 'meta.diff.header',
      },
      {
        foreground: '#515151',
        token: 'comment',
      },
      {
        foreground: '#0F4A85',
        token: 'constant.language',
      },
      {
        foreground: '#096d48',
        token: 'constant.numeric',
      },
      {
        foreground: '#096d48',
        token: 'variable.other.enummember',
      },
      {
        foreground: '#096d48',
        token: 'keyword.operator.plus.exponent',
      },
      {
        foreground: '#096d48',
        token: 'keyword.operator.minus.exponent',
      },
      {
        foreground: '#811F3F',
        token: 'constant.regexp',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.name.tag',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.name.selector',
      },
      {
        foreground: '#264F78',
        token: 'entity.other.attribute-name',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.other.attribute-name.class.css',
      },
      {
        foreground: '#0F4A85',
        token: 'source.css entity.other.attribute-name.class',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.other.attribute-name.id.css',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.other.attribute-name.parent-selector.css',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.other.attribute-name.parent.less',
      },
      {
        foreground: '#0F4A85',
        token: 'source.css entity.other.attribute-name.pseudo-class',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.other.attribute-name.pseudo-element.css',
      },
      {
        foreground: '#0F4A85',
        token: 'source.css.less entity.other.attribute-name.id',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.other.attribute-name.scss',
      },
      {
        foreground: '#B5200D',
        token: 'invalid',
      },
      {
        fontStyle: 'underline',
        token: 'markup.underline',
      },
      {
        foreground: '#000080',
        fontStyle: 'bold',
        token: 'markup.bold',
      },
      {
        foreground: '#0F4A85',
        fontStyle: 'bold',
        token: 'markup.heading',
      },
      {
        fontStyle: 'italic',
        token: 'markup.italic',
      },
      {
        fontStyle: 'strikethrough',
        token: 'markup.strikethrough',
      },
      {
        foreground: '#096d48',
        token: 'markup.inserted',
      },
      {
        foreground: '#5A5A5A',
        token: 'markup.deleted',
      },
      {
        foreground: '#0451A5',
        token: 'markup.changed',
      },
      {
        foreground: '#0451A5',
        token: 'punctuation.definition.quote.begin.markdown',
      },
      {
        foreground: '#0451A5',
        token: 'punctuation.definition.list.begin.markdown',
      },
      {
        foreground: '#0F4A85',
        token: 'markup.inline.raw',
      },
      {
        foreground: '#0F4A85',
        token: 'punctuation.definition.tag',
      },
      {
        foreground: '#0F4A85',
        token: 'meta.preprocessor',
      },
      {
        foreground: '#0F4A85',
        token: 'entity.name.function.preprocessor',
      },
      {
        foreground: '#b5200d',
        token: 'meta.preprocessor.string',
      },
      {
        foreground: '#096d48',
        token: 'meta.preprocessor.numeric',
      },
      {
        foreground: '#0451A5',
        token: 'meta.structure.dictionary.key.python',
      },
      {
        foreground: '#0F4A85',
        token: 'storage',
      },
      {
        foreground: '#0F4A85',
        token: 'storage.type',
      },
      {
        foreground: '#0F4A85',
        token: 'storage.modifier',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.noexcept',
      },
      {
        foreground: '#0F4A85',
        token: 'string',
      },
      {
        foreground: '#0F4A85',
        token: 'meta.embedded.assembly',
      },
      {
        foreground: '#0F4A85',
        token: 'string.comment.buffered.block.pug',
      },
      {
        foreground: '#0F4A85',
        token: 'string.quoted.pug',
      },
      {
        foreground: '#0F4A85',
        token: 'string.interpolated.pug',
      },
      {
        foreground: '#0F4A85',
        token: 'string.unquoted.plain.in.yaml',
      },
      {
        foreground: '#0F4A85',
        token: 'string.unquoted.plain.out.yaml',
      },
      {
        foreground: '#0F4A85',
        token: 'string.unquoted.block.yaml',
      },
      {
        foreground: '#0F4A85',
        token: 'string.quoted.single.yaml',
      },
      {
        foreground: '#0F4A85',
        token: 'string.quoted.double.xml',
      },
      {
        foreground: '#0F4A85',
        token: 'string.quoted.single.xml',
      },
      {
        foreground: '#0F4A85',
        token: 'string.unquoted.cdata.xml',
      },
      {
        foreground: '#0F4A85',
        token: 'string.quoted.double.html',
      },
      {
        foreground: '#0F4A85',
        token: 'string.quoted.single.html',
      },
      {
        foreground: '#0F4A85',
        token: 'string.unquoted.html',
      },
      {
        foreground: '#0F4A85',
        token: 'string.quoted.single.handlebars',
      },
      {
        foreground: '#0F4A85',
        token: 'string.quoted.double.handlebars',
      },
      {
        foreground: '#811F3F',
        token: 'string.regexp',
      },
      {
        foreground: '#0F4A85',
        token: 'punctuation.definition.template-expression.begin',
      },
      {
        foreground: '#0F4A85',
        token: 'punctuation.definition.template-expression.end',
      },
      {
        foreground: '#0F4A85',
        token: 'punctuation.section.embedded',
      },
      {
        foreground: '#000000',
        token: 'meta.template.expression',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.property-value',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.font-name',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.media-type',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.media',
      },
      {
        foreground: '#0451A5',
        token: 'constant.other.color.rgb-value',
      },
      {
        foreground: '#0451A5',
        token: 'constant.other.rgb-value',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.color',
      },
      {
        foreground: '#264F78',
        token: 'support.type.vendored.property-name',
      },
      {
        foreground: '#264F78',
        token: 'support.type.property-name',
      },
      {
        foreground: '#264F78',
        token: 'source.css variable',
      },
      {
        foreground: '#264F78',
        token: 'source.coffee.embedded',
      },
      {
        foreground: '#0451A5',
        token: 'support.type.property-name.json',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.control',
      },
      {
        foreground: '#000000',
        token: 'keyword.operator',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.new',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.expression',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.cast',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.sizeof',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.alignof',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.typeid',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.alignas',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.instanceof',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.logical.python',
      },
      {
        foreground: '#0F4A85',
        token: 'keyword.operator.wordlike',
      },
      {
        foreground: '#096d48',
        token: 'keyword.other.unit',
      },
      {
        foreground: '#0F4A85',
        token: 'punctuation.section.embedded.begin.php',
      },
      {
        foreground: '#0F4A85',
        token: 'punctuation.section.embedded.end.php',
      },
      {
        foreground: '#0451A5',
        token: 'support.function.git-rebase',
      },
      {
        foreground: '#096d48',
        token: 'constant.sha.git-rebase',
      },
      {
        foreground: '#000000',
        token: 'storage.modifier.import.java',
      },
      {
        foreground: '#000000',
        token: 'variable.language.wildcard.java',
      },
      {
        foreground: '#000000',
        token: 'storage.modifier.package.java',
      },
      {
        foreground: '#0F4A85',
        token: 'variable.language',
      },
      {
        foreground: '#5e2cbc',
        token: 'entity.name.function',
      },
      {
        foreground: '#5e2cbc',
        token: 'support.function',
      },
      {
        foreground: '#5e2cbc',
        token: 'support.constant.handlebars',
      },
      {
        foreground: '#5e2cbc',
        token: 'source.powershell variable.other.member',
      },
      {
        foreground: '#5e2cbc',
        token: 'entity.name.operator.custom-literal',
      },
      {
        foreground: '#185E73',
        token: 'support.class',
      },
      {
        foreground: '#185E73',
        token: 'support.type',
      },
      {
        foreground: '#185E73',
        token: 'entity.name.type',
      },
      {
        foreground: '#185E73',
        token: 'entity.name.namespace',
      },
      {
        foreground: '#185E73',
        token: 'entity.other.attribute',
      },
      {
        foreground: '#185E73',
        token: 'entity.name.scope-resolution',
      },
      {
        foreground: '#185E73',
        token: 'entity.name.class',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.numeric.go',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.byte.go',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.boolean.go',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.string.go',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.uintptr.go',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.error.go',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.rune.go',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.cs',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.generic.cs',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.modifier.cs',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.variable.cs',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.annotation.java',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.generic.java',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.java',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.object.array.java',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.primitive.array.java',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.primitive.java',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.token.java',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.groovy',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.annotation.groovy',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.parameters.groovy',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.generic.groovy',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.object.array.groovy',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.primitive.array.groovy',
      },
      {
        foreground: '#185E73',
        token: 'storage.type.primitive.groovy',
      },
      {
        foreground: '#185E73',
        token: 'meta.type.cast.expr',
      },
      {
        foreground: '#185E73',
        token: 'meta.type.new.expr',
      },
      {
        foreground: '#185E73',
        token: 'support.constant.math',
      },
      {
        foreground: '#185E73',
        token: 'support.constant.dom',
      },
      {
        foreground: '#185E73',
        token: 'support.constant.json',
      },
      {
        foreground: '#185E73',
        token: 'entity.other.inherited-class',
      },
      {
        foreground: '#185E73',
        token: 'punctuation.separator.namespace.ruby',
      },
      {
        foreground: '#b5200d',
        token: 'keyword.control',
      },
      {
        foreground: '#b5200d',
        token: 'source.cpp keyword.operator.new',
      },
      {
        foreground: '#b5200d',
        token: 'source.cpp keyword.operator.delete',
      },
      {
        foreground: '#b5200d',
        token: 'keyword.other.using',
      },
      {
        foreground: '#b5200d',
        token: 'keyword.other.directive.using',
      },
      {
        foreground: '#b5200d',
        token: 'keyword.other.operator',
      },
      {
        foreground: '#b5200d',
        token: 'entity.name.operator',
      },
      {
        foreground: '#001080',
        token: 'variable',
      },
      {
        foreground: '#001080',
        token: 'meta.definition.variable.name',
      },
      {
        foreground: '#001080',
        token: 'support.variable',
      },
      {
        foreground: '#001080',
        token: 'entity.name.variable',
      },
      {
        foreground: '#001080',
        token: 'constant.other.placeholder',
      },
      {
        foreground: '#02715D',
        token: 'variable.other.constant',
      },
      {
        foreground: '#02715D',
        token: 'variable.other.enummember',
      },
      {
        foreground: '#001080',
        token: 'meta.object-literal.key',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.property-value',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.font-name',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.media-type',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.media',
      },
      {
        foreground: '#0451A5',
        token: 'constant.other.color.rgb-value',
      },
      {
        foreground: '#0451A5',
        token: 'constant.other.rgb-value',
      },
      {
        foreground: '#0451A5',
        token: 'support.constant.color',
      },
      {
        foreground: '#D16969',
        token: 'punctuation.definition.group.regexp',
      },
      {
        foreground: '#D16969',
        token: 'punctuation.definition.group.assertion.regexp',
      },
      {
        foreground: '#D16969',
        token: 'punctuation.definition.character-class.regexp',
      },
      {
        foreground: '#D16969',
        token: 'punctuation.character.set.begin.regexp',
      },
      {
        foreground: '#D16969',
        token: 'punctuation.character.set.end.regexp',
      },
      {
        foreground: '#D16969',
        token: 'keyword.operator.negation.regexp',
      },
      {
        foreground: '#D16969',
        token: 'support.other.parenthesis.regexp',
      },
      {
        foreground: '#811F3F',
        token: 'constant.character.character-class.regexp',
      },
      {
        foreground: '#811F3F',
        token: 'constant.other.character-class.set.regexp',
      },
      {
        foreground: '#811F3F',
        token: 'constant.other.character-class.regexp',
      },
      {
        foreground: '#811F3F',
        token: 'constant.character.set.regexp',
      },
      {
        foreground: '#000000',
        token: 'keyword.operator.quantifier.regexp',
      },
      {
        foreground: '#EE0000',
        token: 'keyword.operator.or.regexp',
      },
      {
        foreground: '#EE0000',
        token: 'keyword.control.anchor.regexp',
      },
      {
        foreground: '#0F4A85',
        token: 'constant.character',
      },
      {
        foreground: '#EE0000',
        token: 'constant.character.escape',
      },
      {
        foreground: '#000000',
        token: 'entity.name.label',
      },
      {
        foreground: '#316BCD',
        token: 'token.info-token',
      },
      {
        foreground: '#CD9731',
        token: 'token.warn-token',
      },
      {
        foreground: '#CD3131',
        token: 'token.error-token',
      },
      {
        foreground: '#800080',
        token: 'token.debug-token',
      },
    ],
    encodedTokensColors: [],
  },
} as MonacoCustomTheme;
