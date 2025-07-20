package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.WishlistDTO;
import com.pickle_company.pickle.entity.Wishlist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ProductMapper.class)
public interface WishlistMapper {
    @Mapping(source = "id", target = "wishlistId")
    WishlistDTO toDto(Wishlist wishlist);
}

