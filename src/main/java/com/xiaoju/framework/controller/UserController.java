package com.xiaoju.framework.controller;

import com.xiaoju.framework.constants.enums.StatusCode;
import com.xiaoju.framework.entity.dto.User;
import com.xiaoju.framework.entity.exception.CaseServerException;
import com.xiaoju.framework.entity.request.auth.UserLoginReq;
import com.xiaoju.framework.entity.request.auth.UserRegisterReq;
import com.xiaoju.framework.entity.response.controller.Response;
import com.xiaoju.framework.mapper.UserMapper;
import com.xiaoju.framework.service.UserService;
import com.xiaoju.framework.util.CodecUtils;
import com.xiaoju.framework.util.StringUtil;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.util.LinkedList;

/**
 * Created by liuzhi on 2021/4/22.
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Resource
    UserService userService;

    /**
     * 用户注册
     * @param req
     * @param request
     * @param response
     * @return
     */
    @PostMapping("/register")
    public Response<?> register(@RequestBody UserRegisterReq req, HttpServletRequest request, HttpServletResponse response) {
        return Response.success(userService.register(req,request,response));
    }

    /**
     * 用户登录
     * @param req
     * @param request
     * @param response
     * @return
     */
    @PostMapping("/login")
    public Response<?> login(@RequestBody UserLoginReq req, HttpServletRequest request, HttpServletResponse response) {
        return Response.success(userService.login(req,request,response));
    }

    @PostMapping("/quit")
    public Response<?> logout(HttpServletRequest request,HttpServletResponse response) {
        return Response.success(userService.logout(request, response));
    }

    /**
     * 修改密码
     *
     * @param request
     * @param response
     * @return
     */
    @PostMapping("/updatePassWord")
    public Response<?> updatePassWord(@RequestBody UserRegisterReq req, HttpServletRequest request, HttpServletResponse response) {
        return Response.success(userService.updatePassWord(req, request, response));
    }

    /**
     * 获取用户列表
     *
     * @param isDelete
     * @return
     */
    @GetMapping(value = "/getUserList")
    public Response<?> getUserList(
            @RequestParam(defaultValue = "0", required = false) @NotNull(message = "是否删除为空") Integer isDelete) {
        return Response.success(userService.getUserList(isDelete));
    }

    public static void main(String[] args) {
        // String str = "中a111124214124512500A";
        // String reg_charset = "[\u4E00-\u9FA5]*[a-z]*[0-9]*[A-Z]*";
        // Pattern p = Pattern.compile(reg_charset);
        // Matcher m = p.matcher(str);
        // System.out.println(m.matches());
        // if(m.matches()){
        // System.out.println("匹配");
        // }else{
        // System.out.println("不匹配");
        // }

        // String str = "中a111124214124512500A";
        // Pattern pattern = Pattern.compile("[\u4E00-\u9FA5]*[a-z]*[0-9]*[A-Z]*");
        // String str = "刘智1";
        // Pattern pattern = Pattern.compile("[\u4E00-\u9FA5]*[0-9]*");
        // char c[] = str.toCharArray();
        // System.out.println(c);
        // for(int i=0;i<c.length;i++){
        // System.out.println(c[i]);
        // Matcher matcher = pattern.matcher(String.valueOf(c[i]));
        // if(matcher.matches()){
        // System.out.println("true");
        // }else{
        // System.out.println("false");
        // }
        // }

        // String userName = "刘发送艾丝凡阿萨发送智1234567890987654321";
        // if (userName.matches("[\u4E00-\u9FA5]*[0-9]*")) {
        // System.out.println("true");
        // } else {
        // System.out.println("false");
        // }

        LinkedList<String> strs = new LinkedList<String>();
        strs.add("1");
        strs.add("2");
        strs.add("3");
        System.out.println(strs.toString());
        if (StringUtil.isNotEmpty(strs)) {
            System.out.println("true");
        }
    }
}
