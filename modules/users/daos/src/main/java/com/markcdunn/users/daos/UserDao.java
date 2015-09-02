package com.markcdunn.users.daos;

import com.markcdunn.core.daos.BaseDao;
import com.markcdunn.core.daos.search.Search;
import com.markcdunn.users.entities.UserEntity;
import com.markcdunn.users.model.User;

public class UserDao
        extends BaseDao<User, UserEntity, String> {

    public UserDao() {
        super(UserEntity.class);
    }

    public void setSearch(Search<User> userSearch) {
        super.setSearch(userSearch);
    }
}
