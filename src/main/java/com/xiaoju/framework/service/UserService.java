package com.xiaoju.framework.service;

import com.xiaoju.framework.entity.dto.User;
import com.xiaoju.framework.entity.request.auth.UserLoginReq;
import com.xiaoju.framework.entity.request.auth.UserRegisterReq;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.util.List;

/**
 * Created by liuzhi on 2021/4/22.
 */
public interface UserService {
    /**
     * 用户注册
     *
     * @param req     请求参数
     * @param request 请求体
     * @return 用户信息
     */
    User register(UserRegisterReq req, HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException;

    /**
     * 用户登录
     *
     * @param req     请求参数
     * @param request 请求体
     * @return 用户信息
     */
    User login(UserLoginReq req, HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException;

    /**
     * 修改密码
     *
     * @param req     请求参数
     * @param request 请求体
     * @return Integer
     */
    Integer updatePassWord(UserRegisterReq req, HttpServletRequest request, HttpServletResponse response);

    /**
     * 用户退出
     *
     * @param request 请求体
     * @return null
     */
    Integer logout(HttpServletRequest request, HttpServletResponse response);

    /**
     * 获取用户列表
     *
     * @param isDelete 请求参数
     * @return 用户列表
     */
    List<User> getUserList(Integer isDelete);

    /**
     * 获取用户对应权限的路径匹配列表
     *
     * @param username 用户名称
     * @return 对应权限的路径匹配列表
     */
    List<String> getUserAuthorityContent(String username);
}
