package com.skt.mobigen.hms.snapsynchronize.server;

import java.net.InetSocketAddress;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapsynchronize.jobfactory.SnapSynchronizeJobFactory;
import com.skt.mobigen.hms.snapsynchronize.service.SnapSynchronizeService;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;

public class SnapSynchronizeHttpServer {
	private Logger logger = LoggerFactory.getLogger(SnapSynchronizeHttpServer.class);
	private int PORT;

	public SnapSynchronizeHttpServer(int port) {
		this.PORT = port;
	}

	private SnapSynchronizeService synchronizeService;

	public void setSynchronizeService(SnapSynchronizeService synchronizeService) {
		this.synchronizeService = synchronizeService;
	}

	private ServerBootstrap bootstrap = null;
	private EventLoopGroup bossGroup = null;
	private EventLoopGroup workerGroup = null;

	public void start() {
		try {
			bossGroup = new NioEventLoopGroup(1);
			workerGroup = new NioEventLoopGroup();

			bootstrap = new ServerBootstrap();
			bootstrap.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class)
					.handler(new LoggingHandler(LogLevel.INFO)).childHandler(new ChannelInitializer<SocketChannel>() {

						@Override
						protected void initChannel(SocketChannel ch) throws Exception {
							ChannelPipeline p = ch.pipeline();

							p.addLast(new HttpRequestDecoder());
							p.addLast(new HttpResponseEncoder());
							p.addLast(new SnapSynchronizeHttpServerHandler(synchronizeService));
						}
					});
			Channel ch = bootstrap.bind(new InetSocketAddress(PORT)).sync().channel();
			
			
			ch.closeFuture().sync();
		} catch (Exception e) {
			logger.error(ExceptionUtils.getStackTrace(e));
		} finally {
			if (bootstrap != null)
				bootstrap = null;
			if (bossGroup != null)
				bossGroup.shutdownGracefully();
			if (workerGroup != null)
				workerGroup.shutdownGracefully();
		}
	}

}
