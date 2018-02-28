package com.skt.mobigen.hms.snapsynchronize.server.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;

public class HttpServer {
	private Logger logger = LoggerFactory.getLogger(HttpServer.class);
	
	static final int PORT = Integer.parseInt(System.getProperty("port", "18181")); 

	public static void main(String[] args) {
		HttpServer main = new HttpServer();
		try {
			main.start();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void start() throws Exception{
		EventLoopGroup bossGroup = new NioEventLoopGroup(1);
		EventLoopGroup workerGrouop = new NioEventLoopGroup();
		
		try {
			ServerBootstrap b = new ServerBootstrap();
			b.group(bossGroup, workerGrouop).channel(NioServerSocketChannel.class).handler(new LoggingHandler(LogLevel.INFO)).childHandler(new HttpServerInitializer());
			
			Channel ch = b.bind(PORT).sync().channel();
			
			System.err.println("Open your web browser and navigate to " + "http" + "://127.0.0.1:" + PORT + '/');
			
			ch.closeFuture().sync();
		} finally {
			bossGroup.shutdownGracefully();
			workerGrouop.shutdownGracefully();
		}
		
	}

}
