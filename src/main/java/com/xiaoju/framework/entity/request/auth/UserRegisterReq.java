package com.xiaoju.framework.entity.request.auth;

import lombok.Data;

/**
 * Created by liuzhi on 2021/4/22.
 */
@Data
public class UserRegisterReq {
    private String username;

    private String password;

    private String newpassword;

    private boolean isLogin;
}
