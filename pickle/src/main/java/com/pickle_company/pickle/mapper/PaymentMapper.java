package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.PaymentDTO;
import com.pickle_company.pickle.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "orderId", source = "order.id")
    PaymentDTO toDto(Payment payment);
    List<PaymentDTO> toDtoList(List<Payment> payments);
} 