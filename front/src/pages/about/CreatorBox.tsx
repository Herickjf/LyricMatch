interface CreatorBoxProps {
    name: string;
    image: string;
    github: string;
    linkedin: string;
    instagram: string;
}

const CreatorBox: React.FC<CreatorBoxProps> = ({ name, image, github, linkedin, instagram }) => {
    return (
        <div className="creator_box">
            <div className="creator_image" style={{backgroundImage: "url(./avatars/" + image + ")"}}/>
            <div className="info">
                <a href={"https://www.instagram.com/" + instagram} target="_blank" rel="noopener noreferrer" className="creator_name">{name}</a>
                <div className="social_links">
                    <a href={"https://github.com/" + github} target="_blank" rel="noopener noreferrer"  ><i className="fab fa-github-square"   ></i></a>
                    <a href={linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin" ></i></a>
                </div>
            </div>
        </div>
    );
};

export default CreatorBox;