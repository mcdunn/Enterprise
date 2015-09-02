package com.markcdunn.users.transfer_objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.markcdunn.users.model.User;

import java.util.HashMap;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserWrapper {

    private Map<String, String> fields = new HashMap<>();

    public UserWrapper(User user) {
        setUser(user);
    }

    @JsonProperty
    public String getId() {
        return fields.get("id");
    }

    @JsonIgnore
    public void setId(String id) {
        fields.put("id", id);
    }

    public String getFirstName() {
        return fields.get("firstName");
    }

    public void setFirstName(String firstName) {
        fields.put("firstName", firstName);
    }

    public String getLastName() {
        return fields.get("lastName");
    }

    public void setLastName(String lastName) {
        fields.put("lastName", lastName);
    }

    public void getUser(User user) {
        user.setId(fields.get("id"));
        user.setFirstName(fields.get("firstName"));
        user.setLastName(fields.get("lastName"));

    }

    public void setUser(User user) {
        fields.put("id", user.getId());
        fields.put("firstName", user.getFirstName());
        fields.put("lastName", user.getLastName());
    }
}
