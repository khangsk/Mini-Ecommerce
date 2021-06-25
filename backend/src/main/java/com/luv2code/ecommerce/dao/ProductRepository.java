package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {
    //
    // Ta có thể tự viết bằng anotation @Query
    //
    // @Query("select p from Product p where lower(p.name) like lower(concat('%', :searchText, '%')) or ...")
    // Page<Product> doMyCustomFancyStuff(@RequestParam("searchText") String searchText, Pageable pageable)

    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

}
