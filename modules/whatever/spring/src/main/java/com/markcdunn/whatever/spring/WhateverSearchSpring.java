package com.markcdunn.whatever.spring;

import com.markcdunn.whatever.querydsl.WhateverQueryDslSearch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Component("whateverQueryDslSearch")
public class WhateverSearchSpring
        extends WhateverQueryDslSearch {

    private static Logger log = LoggerFactory.getLogger(WhateverSearchSpring.class);

    @PersistenceContext(unitName="entityManagerFactory")
    public void setEntityManager(EntityManager entityManager) {
        super.setEntityManager(entityManager);
    }

}
