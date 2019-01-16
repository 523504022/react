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
