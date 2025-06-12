package com.vinsuite.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendForwardController {

    @RequestMapping(value = {
        "/{path:[^\\.]*}", // handles /activate, /dashboard, etc. (ignores .js/.css)
        "/{path:^(?!api).*$}/**"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
