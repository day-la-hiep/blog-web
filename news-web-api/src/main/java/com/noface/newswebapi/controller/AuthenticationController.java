package com.noface.newswebapi.controller;

import com.nimbusds.jose.JOSEException;
import com.noface.newswebapi.dto.auth.AuthenticationRequest;
import com.noface.newswebapi.dto.auth.IntrospectRequest;
import com.noface.newswebapi.dto.ApiResponse;
import com.noface.newswebapi.dto.auth.AuthenticationResponse;
import com.noface.newswebapi.dto.auth.IntrospectResponse;
import com.noface.newswebapi.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
 
@RestController
@RequestMapping("/api")

public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/auth/users")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody  AuthenticationRequest request) throws JOSEException, ParseException {

        AuthenticationResponse response = authenticationService.authenticate(
                request.getUsername(),
                request.getPassword()
        );
        return ApiResponse.<AuthenticationResponse>builder()
                .result(response).build();

    }

    @PostMapping("/auth/introspect")
    public ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        IntrospectResponse response = authenticationService.verify(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(response).build();
    }
}
