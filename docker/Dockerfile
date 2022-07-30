FROM registry.getech.cn/poros/frontbase:1.0.7


ADD dist /usr/local/openresty/nginx/html

#RUN chmod 777 /usr/share/nginx/html/env.sh

#ENTRYPOINT ["/usr/share/nginx/html/env.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
