export const menu = {
    'button': [{
            'name': '扫码',
            'sub_button': [{
                    'type': 'scancode_waitmsg',
                    'name': '扫码带提示',
                    'key': 'scancode_waitmsg_01',
                // }, {
                //     'type': 'scancode_push',
                //     'name': '扫码推事件',
                //     'key': 'scancode_push_01',
                }
            ]
        }, {
            'name': '发图',
            'sub_button': [{
                    'type': 'pic_sysphoto',
                    'name': '系统拍照发图',
                    'key': 'pic_sysphoto_01'
                }, {
                    'type': 'pic_photo_or_album',
                    'name': '拍照或者相册发图',
                    'key': 'pic_photo_or_album_01'
                }, {
                    'type': 'pic_weixin',
                    'name': '微信相册发图',
                    'key': 'pic_weixin_01'
                }]
        }, {
            'name': '开发调试',
            'sub_button': [{
                    'type':'view',
                    'name':'base',
                    'url':'http://wechat.itomatod.com/oauth/base'
                }, {
                    'type':'view',
                    'name':'userinfo',
                    'url':'http://wechat.itomatod.com/oauth/userinfo'
                }, {
                    'type':'view',
                    'name':'用户信息',
                    'url':'http://wechat.itomatod.com/userinfo'
                }, {
                    'type':'view',
                    'name':'jsapi小样',
                    'url':'http://wechat.itomatod.com/assets/wxpublic.html'
                }
            ]
        // }, {
        //     'name': '发送位置',
        //     'type': 'location_select',
        //     'key': 'location_select_01'
        // }, {
        //     'type': 'media_id',
        //     'name': '图片',
        //     'media_id': 'MEDIA_ID1'
        // }, {
        //     'type': 'view_limited',
        //     'name': '图文消息',
        //     'media_id': 'MEDIA_ID2'
        }
    ]
};
// export const menu = {
//     'button':[{	
//             'type':'click',
//             'name':'今日歌曲',
//             'key':'click_01'
//         }, {
//             'name':'菜单',
//             'sub_button':[
//             {	
//                 'type':'view',
//                 'name':'搜索',
//                 'url':'http://www.soso.com/'
//             }, {
//                 'type':'click',
//                 'name':'赞一下我们',
//                 'key':'click_02'
//             }]
//         }]
// }
// export const menu = {
//     'button':[{	
//             'type':'view',
//             'name':'白夜追凶',
//             'url':'https://www.baidu.com/s?wd=白夜追凶'
//         }]
// }