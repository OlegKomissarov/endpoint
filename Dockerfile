FROM node:latest
WORKDIR /endpoint
ADD package.json ./
ADD app.js ./
COPY . /
RUN npm install
ENV SYSDIG_AGENT_CONF 'app_checks: [{name: node, check_module: prometheus, pattern: {comm: node}, conf: { url: "http://localhost:8081/api/metrics" }}]'
ENTRYPOINT [ "node", "app.js" ]
