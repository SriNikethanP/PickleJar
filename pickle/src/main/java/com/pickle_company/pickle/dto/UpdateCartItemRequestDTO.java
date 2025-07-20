package com.pickle_company.pickle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartItemRequestDTO {
    private Long cartItemId;
    private int quantity; // send 0 or less to remove item
}
