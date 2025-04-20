package com.noface.newswebapi.mapper;

import com.noface.newswebapi.dto.response.CommentResponse;
import com.noface.newswebapi.entity.Comment;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    public Comment asComment(com.noface.newswebapi.dto.request.CommentRequest commentRequest);
    @Mapping(target = "authorUsername", source = "author.username")
    @Mapping(target = "parentArticleId", source = "parentArticle.id")
    public CommentResponse toCommentResponse(Comment comment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public Comment updateComment(@MappingTarget Comment commment, Comment commentUpdate);
}
