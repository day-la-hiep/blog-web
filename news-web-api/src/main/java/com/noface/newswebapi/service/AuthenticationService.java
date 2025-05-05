package com.noface.newswebapi.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.noface.newswebapi.dto.auth.IntrospectRequest;
import com.noface.newswebapi.dto.auth.AuthenticationResponse;
import com.noface.newswebapi.dto.auth.IntrospectResponse;
import com.noface.newswebapi.entity.Permission;
import com.noface.newswebapi.entity.Role;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;

@Slf4j
@Service
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;
    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public AuthenticationResponse authenticate(String username, String password) throws JOSEException, ParseException {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );
        boolean isAuthenticated = passwordEncoder.matches(password, user.getPassword());
        if(!isAuthenticated){
            throw new AppException(ErrorCode.WRONG_USERNAME_PASSWORD);
        }
        String token = generateToken(username);
        return AuthenticationResponse.builder()
                .token(token)
                .tokenInfo(SignedJWT.parse(token).getPayload().toJSONObject().toString())
                .authenticated(isAuthenticated)
                .build();
    }


    private String generateToken(String username) throws JOSEException {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);


        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .issuer("Hiep")
                .subject(username)
                .issueTime(new Date())
                .expirationTime(new Date(
                        (Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli())
                ))
                .claim("scope", getAuthorityInfo(username))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try{
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        }catch (JOSEException e){
            log.error("Cannot create token", e);
            throw  new RuntimeException(e);
        }
    }

    public IntrospectResponse verify(IntrospectRequest request) throws JOSEException, ParseException {
        String token = request.getToken();

        JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT;
        Date expiredTime;
        try{
            signedJWT = SignedJWT.parse(token);
            expiredTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        }catch (ParseException e){
            return IntrospectResponse.builder()
                    .valid(false)
                    .build();
        }
        return IntrospectResponse.builder()
                .valid(signedJWT.verify(jwsVerifier) && expiredTime.after(new Date()))
                .tokenInfo(signedJWT.getPayload().toJSONObject().toString())
                .build();
    }

    public String getAuthorityInfo(String username){
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );
        return "ROLE_" + user.getUserRole();
    }
}
