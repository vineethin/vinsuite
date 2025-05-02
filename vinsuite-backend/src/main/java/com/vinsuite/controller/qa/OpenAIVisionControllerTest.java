// package com.vinsuite.controller.qa;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.*;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.web.client.RestTemplate;

// import java.util.List;
// import java.util.Map;

// import static org.mockito.Mockito.*;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// import com.fasterxml.jackson.databind.ObjectMapper;

// @WebMvcTest(OpenAIVisionController.class)
// public class OpenAIVisionControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private RestTemplate restTemplate;

//     @Autowired
//     private ObjectMapper objectMapper;

//     @Test
//     public void testGenerateXPath_successful() throws Exception {
//         Map<String, String> input = Map.of(
//                 "html", "<html><body><div>Test</div></body></html>",
//                 "imageBase64", "fakeBase64string"
//         );

//         Map<String, Object> mockResponse = Map.of(
//                 "choices", List.of(Map.of("message", Map.of("content", "XPath: //div[text()='Test']")))
//         );

//         when(restTemplate.postForObject(anyString(), any(HttpEntity.class), eq(Map.class)))
//                 .thenReturn(mockResponse);

//         mockMvc.perform(post("/api/openai-xpath")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(input)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.output.content").value("XPath: //div[text()='Test']"));
//     }

//     @Test
//     public void testGenerateXPath_missingInput() throws Exception {
//         Map<String, String> badInput = Map.of("html", "<div>Only HTML</div>");

//         mockMvc.perform(post("/api/openai-xpath")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(badInput)))
//                 .andExpect(status().isBadRequest())
//                 .andExpect(jsonPath("$.error").value("Missing HTML or imageBase64"));
//     }
// }
