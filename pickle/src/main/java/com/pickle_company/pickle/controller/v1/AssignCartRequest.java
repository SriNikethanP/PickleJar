package com.pickle_company.pickle.controller.v1;



import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignCartRequest {
    private Long cartId;
    private Long customerId;

    public Long getCartId() {
        return cartId;
    }
    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }
    public Long getCustomerId() {
        return customerId;
    }
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
} 