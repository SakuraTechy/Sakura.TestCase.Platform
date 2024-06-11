package com.xiaoju.framework.mapper;

import com.xiaoju.framework.entity.dto.User;

import java.util.List;

public interface UserMapper {
    int deleteByPrimaryKey(Long id);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(Long id);

    User selectByUserName(String username);

    List<User> getUserList(Integer isDelete);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    int updateUserPassWord(String username, String password);
}