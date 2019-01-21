import ajax from './ajax'
import jsonp from 'jsonp'
//登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

// 请求获取天气
export function reqWeather (city){
    return new Promise (function(resolve,reject){
        // 发异步ajax请求
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(
            url,
            {param:'callback'},
            (error,data) => {
                if(!error){
                    // 成功则调用resolve传递数据
                    const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                    resolve({dayPictureUrl,weather})
                } else {
                    // 出错则显示提示
                    alert('请求天气接口出错')
                }
            }
        )
    })
} 

// 获取一级、二级分类列表 
export const reqCategorys = (parentId) => ajax('/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = (parentId,categoryName) => ajax('/manage/category/add',{parentId,categoryName},'POST')
// 更新分类
export const reqUpdateCategorys = ({categoryId,categoryName}) => ajax('/manage/category/update',{categoryId,categoryName},'POST')
// 获取指定页的分页列表
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize},)
// 搜索商品分页列表
export const reqSearchProducts = ({pageNum,pageSize,searchType,searchName}) => ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

// 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

// 添加或者更新商品
export const reqAddUpdateCategor = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'),product,'POST')