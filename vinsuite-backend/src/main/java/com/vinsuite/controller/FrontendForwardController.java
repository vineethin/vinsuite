package com.vinsuite.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendForwardController {

    @RequestMapping(value = { "/", "/{path:^(?!api|static|assets|favicon\\.ico|robots\\.txt).*$}" })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
