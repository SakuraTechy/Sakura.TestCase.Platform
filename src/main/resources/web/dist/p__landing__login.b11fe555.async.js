(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{Aqrb:function(e,t,a){"use strict";a.r(t);a("+L6B");var s=a("2/Rp"),n=(a("sRBo"),a("kaz8")),l=(a("y8nQ"),a("Vl3Y")),i=(a("5NDa"),a("5rEg")),r=(a("Pwec"),a("CtXQ")),c=(a("miYZ"),a("tsqr")),o=a("p0pE"),p=a.n(o),d=a("q1tI"),m=a.n(d),h=(a("nXRE"),a("on7z"));t.default=l.a.create()(class extends m.a.PureComponent{constructor(e){super(e),this.typeChange=(e=>{this.setState({type:e},()=>{this.props.form.resetFields()})}),this.onOk=(()=>{this.props.form.validateFields((e,t)=>{e||(this.setState({loading:!0}),"1"===this.state.type?Object(h.a)("/user/login",{method:"POST",body:p()({},t)}).then(e=>{e&&200===e.code?(c.a.success("登陆成功"),window.location.href="/case/caseList/1"):c.a.error(e.msg),this.setState({loading:!1})}):"2"===this.state.type?Object(h.a)("/user/register",{method:"POST",body:p()({},t)}).then(e=>{e&&200===e.code?(c.a.success("注册成功"),window.location.href="/case/caseList/1"):c.a.error(e.msg),this.setState({loading:!1})}):"3"===this.state.type&&Object(h.a)("/user/updatePassWord",{method:"POST",body:p()({},t)}).then(e=>{e&&200===e.code?(c.a.success("修改成功"),this.typeChange("1")):c.a.error(e.msg),this.setState({loading:!1})}))})}),this.state={type:"1",loading:!1}}render(){var e=this.props.form.getFieldDecorator,t=this.state,a=t.type,c=t.loading;return m.a.createElement("div",{className:"login"},m.a.createElement("div",{className:"3"!=a?"card":"card1"},m.a.createElement("div",{className:"title"},"小智科技",m.a.createElement("span",null,"一套敏捷的测试用例管理平台")),"3"!=a?m.a.createElement("span",{className:"1"===a?"btn btn_active":"btn",onClick:()=>this.typeChange("1")},"登录"):null,"3"!=a?m.a.createElement("span",{className:"2"===a?"btn btn_active":"btn",onClick:()=>this.typeChange("2")},"注册"):null,"3"===a?m.a.createElement("span",{className:"2"===a?"btn btn_active":"btn",style:{width:"400px"},onClick:()=>this.typeChange("1")},"修改密码"):null,m.a.createElement("div",{className:"input"},m.a.createElement(l.a.Item,{label:""},e("username",{rules:[{required:!0,message:"请填写中文账号"},{max:10,message:"请填写10位以内的中文账号"},{pattern:new RegExp("^[一-龥]*[0-9]*$"),message:"用户名必须为汉字或者数字"}],initialValue:void 0})(m.a.createElement(i.a,{placeholder:"中文账号",maxlength:"11",prefix:m.a.createElement(r.a,{type:"user"})}))),m.a.createElement(l.a.Item,{label:""},e("password",{rules:[{required:!0,message:"3"!=a?"请填写密码":"请填写新密码"}],initialValue:void 0})(m.a.createElement(i.a.Password,{placeholder:"3"!=a?"密码":"新密码",maxlength:"30",prefix:m.a.createElement(r.a,{type:"lock"})}))),"3"===a?m.a.createElement(l.a.Item,{label:""},e("newpassword",{rules:[{required:!0,message:"请填写确认新密码"}],initialValue:void 0})(m.a.createElement(i.a.Password,{placeholder:"确认新密码",maxlength:"30",prefix:m.a.createElement(r.a,{type:"lock"})}))):null,m.a.createElement(l.a.Item,null,"3"!=a?e("isLogin",{valuePropName:"checked",initialValue:!0})(m.a.createElement(n.a,{style:{top:"-15px"}},"记住登录状态（默认1天）")):null,"3"!=a?m.a.createElement("a",{href:"#",style:{position:"absolute",left:"345px",width:"60px",top:"-25px"},onClick:()=>this.typeChange("3")},"忘记密码"):null)),m.a.createElement(s.a,{type:"primary",style:{top:"-30px"},className:"onBtn",loading:c,onClick:()=>this.onOk()},"1"===a?"登录":"2"===a?"注册并登录":"确认修改")))}})},nXRE:function(e,t,a){e.exports={login:"login",card:"card",title:"title",btn:"btn",btn_active:"btn_active",input:"input",card1:"card1",onBtn:"onBtn",zIndex:"zIndex"}}}]);