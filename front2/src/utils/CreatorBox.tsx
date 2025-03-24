interface CreatorInfo{
    name: string,
    image: string,
    subtitle: string,
    linkedin_link: string,
    github_link: string
}

const CreatorBox: React.FC<CreatorInfo> = ({name, image, subtitle, linkedin_link, github_link}) => {
    return (
        <div>
            <div 
                className="creator_image bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
            />

            <div className="creator_descriptions">
                <div className="creator_name"     >{name}</div>
                <div className="creator_subtitle" >{subtitle}</div>
                <div className="creator_icons_box">
                    <div className="creator_icons creator_linkedin" style={{ backgroundImage: `url(${linkedin_link})` }}/>
                    <div className="creator_icons creator_github"   style={{ backgroundImage: `url(${github_link})` }}/>
                </div>
            </div>
        </div>
    )
}

export default CreatorBox
