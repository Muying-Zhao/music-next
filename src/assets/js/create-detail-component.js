import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: { MusicList },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      // 缓存
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          // 缓存
          const cached = storage.session.get(key)
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      // 获取图片
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      // 获取标题
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    /*
    1、获取计算属性 computedData 的值，并将其存储在常量 data 中。
    2、如果 data 不存在，则获取当前路由的匹配路径（通过 $route.matched[0].path），
    并使用 $router.push 方法进行重定向到该路径。然后返回，因为没有必要继续执行下面的代码了。
    3、如果 data 存在，则使用 fetch() 函数发起异步网络请求，获取数据。
    4、等待 processSongs() 函数处理 result.songs 数据，并将结果保存在组件实例的 songs 属性中。
    5、将 loading 属性设置为 false，表示数据已加载完毕。
    */
    async created() {
      const data = this.computedData
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      const result = await fetch(data)
      this.songs = await processSongs(result.songs)
      // console.log(this.songs)
      this.loading = false
    }
  }
}
