package com.xiaoju.framework.entity.request.auth;

import lombok.Data;

/**
 * Created by liuzhi on 2021/4/22.
 */
@Data
public class UserLoginReq {
    private String username;

    private String password;
}
