(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{Aqrb:function(e,t,a){"use strict";a.r(t);a("5LhE");var n=a("zVyI"),s=(a("oD+/"),a("ARml")),r=(a("1eZo"),a("IiiV")),i=(a("XauL"),a("TQO2")),o=(a("jCfn"),a("j7im")),l=(a("aJ4I"),a("q5M+")),c=a("bLu6"),d=a.n(c),p=a("nNWW"),m=a.n(p),u=(a("nXRE"),a("on7z"));t.default=r.a.create()(class extends m.a.PureComponent{constructor(e){super(e),this.typeChange=(e=>{this.setState({type:e},()=>{this.props.form.resetFields()})}),this.onOk=(()=>{this.props.form.validateFields((e,t)=>{e||(this.setState({loading:!0}),"1"===this.state.type?Object(u.a)("/user/login",{method:"POST",body:d()({},t)}).then(e=>{e&&200===e.code?(l.a.success("登陆成功"),window.location.href="/case/caseList/1"):l.a.error(e.msg),this.setState({loading:!1})}):"2"===this.state.type?Object(u.a)("/user/register",{method:"POST",body:d()({},t)}).then(e=>{e&&200===e.code?(l.a.success("注册成功"),window.location.href="/case/caseList/1"):l.a.error(e.msg),this.setState({loading:!1})}):"3"===this.state.type&&Object(u.a)("/user/updatePassWord",{method:"POST",body:d()({},t)}).then(e=>{e&&200===e.code?(l.a.success("修改成功"),this.typeChange("1")):l.a.error(e.msg),this.setState({loading:!1})}))})}),this.state={type:"1",loading:!1}}render(){var e=this.props.form.getFieldDecorator,t=this.state,a=t.type,l=t.loading;return m.a.createElement("div",{className:"login"},m.a.createElement("div",{className:"3"!=a?"card":"card1"},m.a.createElement("div",{className:"title"},"昂楷科技",m.a.createElement("span",null,"一套敏捷的测试用例管理平台")),"3"!=a?m.a.createElement("span",{className:"1"===a?"btn btn_active":"btn",onClick:()=>this.typeChange("1")},"登录"):null,"3"!=a?m.a.createElement("span",{className:"2"===a?"btn btn_active":"btn",onClick:()=>this.typeChange("2")},"注册"):null,"3"===a?m.a.createElement("span",{className:"2"===a?"btn btn_active":"btn",style:{width:"400px"},onClick:()=>this.typeChange("1")},"修改密码"):null,m.a.createElement("div",{className:"input"},m.a.createElement(r.a.Item,{label:""},e("username",{rules:[{required:!0,message:"请填写中文账号"},{max:10,message:"请填写10位以内的中文账号"},{pattern:new RegExp("^[一-龥]*[0-9]*$"),message:"用户名必须为汉字或者数字"}],initialValue:void 0})(m.a.createElement(i.a,{placeholder:"中文账号",maxlength:"11",prefix:m.a.createElement(o.a,{type:"user"})}))),m.a.createElement(r.a.Item,{label:""},e("password",{rules:[{required:!0,message:"3"!=a?"请填写密码":"请填写新密码"}],initialValue:void 0})(m.a.createElement(i.a.Password,{placeholder:"3"!=a?"密码":"新密码",maxlength:"30",prefix:m.a.createElement(o.a,{type:"lock"})}))),"3"===a?m.a.createElement(r.a.Item,{label:""},e("newpassword",{rules:[{required:!0,message:"请填写确认新密码"}],initialValue:void 0})(m.a.createElement(i.a.Password,{placeholder:"确认新密码",maxlength:"30",prefix:m.a.createElement(o.a,{type:"lock"})}))):null,m.a.createElement(r.a.Item,null,"3"!=a?e("isLogin",{valuePropName:"checked",initialValue:!0})(m.a.createElement(s.a,{style:{top:"-15px"}},"记住登录状态（默认1天）")):null,"3"!=a?m.a.createElement("a",{href:"#",style:{position:"absolute",left:"345px",width:"60px",top:"-25px"},onClick:()=>this.typeChange("3")},"忘记密码"):null)),m.a.createElement(n.a,{type:"primary",style:{top:"-30px"},className:"onBtn",loading:l,onClick:()=>this.onOk()},"1"===a?"登录":"2"===a?"注册并登录":"确认修改")))}})},nXRE:function(e,t,a){e.exports={login:"login",card:"card",title:"title",btn:"btn",btn_active:"btn_active",input:"input",card1:"card1",onBtn:"onBtn",zIndex:"zIndex"}},on7z:function(e,t,a){"use strict";a.d(t,"a",function(){return c});a("TLRS");var n=a("SXAR"),s=a("bLu6"),r=a.n(s),i=a("4tTT"),o=a.n(i);window.apiPrefix="/api",o.a.defaults.timeout=3e5,o.a.defaults.withCredentials=!0;var l={200:"服务器成功返回请求的数据。",201:"新建或修改数据成功。",202:"一个请求已经进入后台排队（异步任务）。",204:"删除数据成功。",400:"发出的请求有错误，服务器没有进行新建或修改数据的操作。",401:"用户没有权限（令牌、用户名、密码错误）。",403:"用户得到授权，但是访问是被禁止的。",404:"发出的请求针对的是不存在的记录，服务器没有进行操作。",406:"请求的格式不可得。",410:"请求的资源被永久删除，且不会再得到的。",422:"当创建一个对象时，发生一个验证错误。",500:"服务器发生错误，请检查服务器。",502:"网关错误。",503:"服务不可用，服务器暂时过载或维护。",504:"网关超时。"};function c(e,t){var a={};if(a.method=void 0!==t?t.method:"get",t&&(t.body&&(a.data="string"==typeof t.body?JSON.parse(t.body):t.body),void 0!==t.params)){for(var s in e+="?",t.params)void 0!==t.params[s]&&""!==t.params[s]&&(e=e+s+"="+t.params[s]+"&");e=e.substring(0,e.length-1)}return o()(r()({url:e},a)).then(e=>{if(401===e.data.code||401===e.code){var t="".concat(e.data.data.login_url,"?app_id=").concat(e.data.data.app_id),a=encodeURIComponent(window.location.href),n="".concat(t,"&version=1.0&jumpto=").concat(a);return window.location.href=n,Promise.reject(new Error("服务不可用，请联系管理员"))}if(99993===e.data.code||99993===e.code){return window.location.href="/login",Promise.reject(new Error("服务不可用，请联系管理员"))}return r()({},e.data)}).catch(e=>{if(e.response){var t=e.response.status,a=l[t]||e.response.statusText;return n.a.error({message:"请求错误 ".concat(t),description:a}),{code:t,message:a}}})}o.a.interceptors.request.use(e=>(e.baseURL=window.apiPrefix,e),e=>Promise.reject(e)),o.a.interceptors.response.use(e=>e,e=>Promise.reject(e))}}]);