package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(path = "states")
public interface StateRepository extends JpaRepository<State, Integer> {

    List<State> findByCountryCode(@RequestParam("code") String code);

//    List<State> findByCountryName(@RequestParam("name") String name);
//
//    List<State> findByCountryId(@RequestParam("id") Integer id);    ---> Can't find by ID????
}
