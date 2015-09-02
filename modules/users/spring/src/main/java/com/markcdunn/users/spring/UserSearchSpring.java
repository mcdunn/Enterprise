package com.markcdunn.users.spring;

import com.markcdunn.users.querydsl.UserQueryDslSearch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Component("userQueryDslSearch")
public class UserSearchSpring
        extends UserQueryDslSearch {

    private static Logger log = LoggerFactory.getLogger(UserSearchSpring.class);

    @PersistenceContext(unitName="entityManagerFactory")
    public void setEntityManager(EntityManager entityManager) {
        super.setEntityManager(entityManager);
    }

}
