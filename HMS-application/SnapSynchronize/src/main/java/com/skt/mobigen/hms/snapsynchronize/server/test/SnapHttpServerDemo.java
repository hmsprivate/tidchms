package com.skt.mobigen.hms.snapsynchronize.server.test;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;

public class SnapHttpServerDemo {
	private Logger logger = LoggerFactory.getLogger(SnapHttpServerDemo.class);
	private final int PORT = Integer.parseInt(System.getProperty("port", "18181"));
	
	public static void main (String[] args) {
		SnapHttpServerDemo main = new SnapHttpServerDemo();
		main.start();
	}

	private void start() {
		EventLoopGroup bossGroup = new NioEventLoopGroup(1);
		EventLoopGroup workerGrouop = new NioEventLoopGroup();
		
		try {
			ServerBootstrap b = new ServerBootstrap();
			b.group(bossGroup, workerGrouop)
				.channel(NioServerSocketChannel.class)
				.handler(new LoggingHandler(LogLevel.INFO))
				.childHandler(new SnapHttpServerDemoInitializer());
			
			Channel ch = b.bind(PORT).sync().channel();
			
			logger.debug("Open your web browser and navigate to " + "http" + "://127.0.0.1:" + PORT + '/');
			
			ch.closeFuture().sync();
		} catch (Exception e) {
			logger.error(ExceptionUtils.getStackTrace(e));
			
		} finally {
			bossGroup.shutdownGracefully();
			workerGrouop.shutdownGracefully();
		}
		
	}

}
