package com.example.Atiko.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.boot.web.servlet.FilterRegistrationBean; 
import org.springframework.web.multipart.support.MultipartFilter;
@Configuration
public class ResourceWebConfig implements WebMvcConfigurer {
  final Environment environment;

  public ResourceWebConfig(Environment environment) {
    this.environment = environment;
  }

  @Override
  public void addResourceHandlers(final ResourceHandlerRegistry registry) {
    String location = environment.getProperty("app.file.storage.mapping");

    registry.addResourceHandler("/uploads/**")
    .addResourceLocations(location)
    .addResourceLocations("file:./uploads/files/");
  }


//   @Bean
// public MultipartResolver multipartResolver() {
//     commonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
//     commonsMultipartResolver.setMaxUploadSize(100000);
//     commonsMultipartResolver.setDefaultEncoding("UTF-8");
//     return commonsMultipartResolver;
// }



    @Bean
    public FilterRegistrationBean multipartFilterRegistrationBean() {
        final MultipartFilter multipartFilter = new MultipartFilter();
        final FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean(multipartFilter);
        filterRegistrationBean.addInitParameter("multipartResolverBeanName", "commonsMultipartResolver");
        return filterRegistrationBean;
    }

  //   @Bean
  // public WebMvcConfigurer corsConfigurer() {
  //     return new WebMvcConfigurer() {
  //         @Override
  //         public void addCorsMappings(CorsRegistry registry) {
  //             registry.addMapping("/api/**").allowedMethods("GET", "POST", "PUT", "DELETE");
  //         }
  //     };
  // }
}
