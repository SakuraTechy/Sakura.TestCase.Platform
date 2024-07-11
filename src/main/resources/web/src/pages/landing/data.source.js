/* eslint-disable */
import React from 'react'
import logoImg from './img/atclogo4.png'
import getQueryString from '@/utils/getCookies'
const getCookies = getQueryString.getCookie
export const Banner30DataSource = {
  wrapper: { className: 'banner3' },
  textWrapper: {
    className: 'banner3-text-wrapper',
    children: [
      {
        name: 'slogan',
        className: 'banner3-slogan',
        children: (
          <div>
            <img src={logoImg} className="banner3-logo" />
            <br />
            <span>小智科技</span>
          </div>
        ),
      },
      {
        name: 'name',
        className: 'banner3-name',
        children: (
          <span>
            <p>一套敏捷的测试场景管理平台</p>
          </span>
        ),
      },
      {
        name: 'nameEn',
        className: 'banner3-name-en',
        children: (
          <span style={{ color: '#7d899b' }}>
                        以脑图方式编辑可快速上手，场景关联需求形成流程闭环，并支持组件化引用，
            <br />
                        可在各个平台嵌入使用，是测试人员的贴心助手
          </span>
        ),
      },
      {
        name: 'button',
        className: 'banner3-button',
        children: (
          <span>
            <p>开始使用</p>
          </span>
        ),
        href: getCookies('username') ? '/case/caseList/1' : `/login?/case/caseList/1`,
      },
    ],
  },
}
export const Footer00DataSource = {
  wrapper: { className: 'home-page-wrapper footer0-wrapper' },
  OverPack: { className: 'home-page footer0', playScale: 0.05 },
  copyright: {
    className: 'copyright',
    children: (
      <span>
        <p>
          <span>Copyright © 2024 深圳市小智科技有限公司 保留所有版权</span>
        </p>
      </span>
    ),
  },
}
