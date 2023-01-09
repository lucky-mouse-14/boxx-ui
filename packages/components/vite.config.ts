import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // 指定使用的 tsconfig.json 我们整个项目根目录下掉， 如果不配置，你也可以在 components 下新建 tsconfig.json
      tsConfigFilePath: '../../tsconfig.json'
    }),
    // 因为这个插件默认打包到 es 下，我们想让 lib 目录下也生成声明文件需要再配置一个
    dts({
      outputDir: 'lib',
      tsConfigFilePath: '../../tsconfig.json'
    })
  ],
  build: {
    target: 'modules',
    // 打包文件目录
    outDir: 'es',
    // 压缩
    minify: false,
    // css 分离
    // cssCodeSplit: true
    rollupOptions: {
      // 忽略打包 vue 文件
      external: ['vue'],
      input: ['src/index.ts'],
      output: [
        {
          format: 'es',
          // 不用打包成 .ese.js, 这里我们想把它打包成.js
          entryFileNames: '[name].js',
          // 让打包目录和我们目录对应
          preserveModules: true,
          // 配置打包根目录
          dir: 'es',
          preserveModulesRoot: 'src'
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          // 让打包目录和我们目录对应
          preserveModlues: true,
          // 配置打包根目录
          dir: 'lib',
          preserveModulesRoot: 'src'
        }
      ]
    },
    lib: {
      entry: './index.ts',
      // 打包cjs(CommonJS)和esm(ESModule)两种形式,cjs模式主要用于服务端引用(ssr),而esm就是我们现在经常使用的方式
      formats: ['es', 'cjs']
    }
  }
})