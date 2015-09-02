package com.markcdunn.users.services.impl;

import com.markcdunn.core.services.BaseDataService;
import com.markcdunn.users.entities.UserEntity;
import com.markcdunn.users.model.User;
import com.markcdunn.users.services.UserDataService;

public class UserDataServiceImpl
        extends BaseDataService<User, UserEntity, String>
        implements UserDataService {

    public UserDataServiceImpl() {
        super(UserEntity.class);
    }
}
