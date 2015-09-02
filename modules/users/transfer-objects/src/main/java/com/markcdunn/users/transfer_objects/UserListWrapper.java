package com.markcdunn.users.transfer_objects;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.markcdunn.users.model.User;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserListWrapper {

    private List<UserWrapper> users;

    public UserListWrapper(List<User> users) {
        this.users = new ArrayList<>();
        for (User user : users) {
            this.users.add(new UserWrapper(user));
        }
    }

    public List<UserWrapper> getUsers() {
        return users;
    }
}
