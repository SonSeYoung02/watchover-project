package com.chh.watchover.domain.calendar.model.type;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class EmotionTypeConverter implements AttributeConverter<EmotionType, String> {

    @Override
    public String convertToDatabaseColumn(EmotionType attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public EmotionType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }

        if (dbData.contains("기쁨") || dbData.contains("행복") || dbData.contains("湲")) {
            return EmotionType.기쁨;
        }
        if (dbData.contains("화남") || dbData.contains("분노") || dbData.contains("붾")) {
            return EmotionType.화남;
        }
        if (dbData.contains("혐오") || dbData.contains("삤")) {
            return EmotionType.혐오;
        }
        if (dbData.contains("슬픔") || dbData.contains("뵒")) {
            return EmotionType.슬픔;
        }
        if (dbData.contains("평온") || dbData.contains("안정") || dbData.contains("차분")) {
            return EmotionType.평온;
        }
        if (dbData.contains("불안") || dbData.contains("걱정") || dbData.contains("두려")) {
            return EmotionType.불안;
        }

        try {
            return EmotionType.valueOf(dbData);
        } catch (IllegalArgumentException e) {
            return EmotionType.슬픔;
        }
    }
}
