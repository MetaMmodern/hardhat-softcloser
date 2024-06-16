export default {
  importOrder: ["<THIRD_PARTY_MODULES>", "^[./]"],
importOrderParserPlugins: ["typescript"],
importOrderSeparation: true,
importOrderSortSpecifiers: true,
"plugins": ["@trivago/prettier-plugin-sort-imports"],
}
