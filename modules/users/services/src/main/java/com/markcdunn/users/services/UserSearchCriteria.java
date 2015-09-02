package com.markcdunn.users.services;

import com.markcdunn.core.daos.search.BaseSearchCriteria;
import com.markcdunn.users.model.User;

import java.util.Map;

public class UserSearchCriteria
        extends BaseSearchCriteria<User> {

    private String id;
    private String firstName;
    private String lastName;

    public UserSearchCriteria() {
    }

    public UserSearchCriteria(Map<String, String> values) {
        applyValues(values);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void applyValues(Map<String, String> values) {
        super.applyValues(values);
        setId(values.get("id"));
        setFirstName(values.get("firstName"));
        setLastName(values.get("lastName"));
    }
}
