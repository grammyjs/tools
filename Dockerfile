FROM denoland/deno as builder
WORKDIR /app
COPY . /app
RUN deno task build

FROM denoland/deno
EXPOSE 8000
COPY --from=builder /app/.ultra /app
WORKDIR /app
CMD ["deno", "task", "start"]
