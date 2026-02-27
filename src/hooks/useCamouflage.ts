import { useState, useEffect } from 'react';

export const useCamouflage = (
    isCamouflaged: boolean,
    skinType: string
) => {
    // 保存原始的文档状态
    const [originalTitle] = useState(document.title);
    const [originalIcon] = useState(() => {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        return link ? link.href : '';
    });

    useEffect(() => {
        const iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

        if (isCamouflaged) {
            if (skinType === 'dashboard') {
                document.title = 'Analytics Dashboard - Internal';
                if (iconLink) iconLink.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>';
            } else if (skinType === 'doc') {
                document.title = 'React Documentation';
                if (iconLink) iconLink.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📘</text></svg>';
            } else if (skinType === 'winupdate') {
                document.title = 'Update in progress...';
                if (iconLink) iconLink.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚙️</text></svg>';
            }
        } else {
            document.title = originalTitle;
            if (iconLink) iconLink.href = originalIcon;
        }

        // Cleanup: 如果组件卸载确保恢复原样
        return () => {
            document.title = originalTitle;
            if (iconLink) iconLink.href = originalIcon;
        };
    }, [isCamouflaged, skinType, originalTitle, originalIcon]);

    return null;
};
