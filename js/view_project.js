var urlParams = new URLSearchParams(window.location.search);
var project_name = urlParams.get('project');

if (!project_name) {
    window.location.href = '/index.html';
}

function get_projects(){
    // return json of projects from /files.json
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../files.json', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        }
        xhr.send();
    });
}

function extract_project_data(projectName){
    // get the project json and project name loops trough the json until it finds the project with the same name as the parameter then we return the project
    return new Promise(function(resolve, reject){
        get_projects().then(function(projects){
            var project = projects.Projects.find(function(project){
                return project.Name === projectName;
            });
            resolve(project);
        });
    });
}

function display_project(){
    extract_project_data(project_name).then(function(project){
        var title = document.getElementById('title');
        title.innerHTML = project.Name;
        var notes = document.getElementById('notes');
        var note_text = "";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', project.Notes, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                note_text = xhr.responseText;
                note_text = note_text.replaceAll("\n","<br>");
                notes.innerHTML = note_text;

            }
        }
 
        xhr.send();
        notes.innerHTML = notes.innerHTML.replace("\n","<br>")
        var screenshots = document.getElementById('screenshots');
        if (project.Screenshots) {
            project.Screenshots.forEach(function (screenshot) {
                var img = document.createElement('img');
                img.src = screenshot;
                img.onclick = function () {
                    window.open(screenshot);
                }
                screenshots.appendChild(img);
            });
        }
        var files = document.getElementById('files');
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        th.innerHTML = 'Name';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'File Name';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Download';
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);
        var tbody = document.createElement('tbody');
        
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = '<i class="bi bi-box"></i> Blender file';
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = project.Blender_File.replace(/^.*[\\\/]/, '');
        tr.appendChild(td);
        td = document.createElement('td');
        var a = document.createElement('a');
        a.href = project.Blender_File;
        a.download = project.Blender_File.replace(/^.*[\\\/]/, '');
        a.innerHTML = '<i class="bi bi-download"></i>';
        a.style = "text-decoration: none;text-align: center; display: block;";
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = '<i class="bi bi-image"></i> Thumbnail';
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = project.Thumbnail.replace(/^.*[\\\/]/, '');
        tr.appendChild(td);
        td = document.createElement('td');
        var a = document.createElement('a');
        a.href = project.Thumbnail;
        a.download = project.Thumbnail.replace(/^.*[\\\/]/, '');
        a.innerHTML = '<i class="bi bi-download"></i>';
        a.style = "text-decoration: none;text-align: center; display: block;";        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
        for (var key in project.Other_files) {
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var file_name =  key.replace("_", " ");
            var full_file_name = project.Other_files[key].replace(/^.*[\\\/]/, '');
            if (full_file_name.endsWith(".png") || full_file_name.endsWith(".jpg") || full_file_name.endsWith(".jpeg") || full_file_name.endsWith(".gif") || full_file_name.endsWith(".bmp") || full_file_name.endsWith(".tiff") || full_file_name.endsWith(".webp")) {
                file_name = '<i class="bi bi-image"></i> ' + file_name;
            } else if (full_file_name.endsWith(".mp4") || full_file_name.endsWith(".webm") || full_file_name.endsWith(".ogg") || full_file_name.endsWith(".avi") || full_file_name.endsWith(".mov") || full_file_name.endsWith(".flv") || full_file_name.endsWith(".wmv") || full_file_name.endsWith(".mkv")) {
                file_name = '<i class="bi bi-film"></i> ' + file_name;
            } else if (full_file_name.endsWith(".obj") || full_file_name.endsWith(".fbx") || full_file_name.endsWith(".3ds") || full_file_name.endsWith(".dae") || full_file_name.endsWith(".stl") || full_file_name.endsWith(".ply") || full_file_name.endsWith(".dxf") || full_file_name.endsWith(".gltf") || full_file_name.endsWith(".glb")) {
                file_name = '<i class="bi bi-boxes"></i> ' + file_name;
            } else if (full_file_name.endsWith(".mtl")){
                file_name = '<i class="bi bi-brush"></i> ' + file_name;
            } else if (full_file_name.endsWith(".blend")) {
                file_name = '<i class="bi bi-box"></i> ' + file_name;
            } else if (full_file_name.endsWith(".zip") || full_file_name.endsWith(".rar") || full_file_name.endsWith(".7z") || full_file_name.endsWith(".tar") || full_file_name.endsWith(".gz") || full_file_name.endsWith(".bz2") || full_file_name.endsWith(".xz")) {
                file_name = '<i class="bi bi-archive"></i> ' + file_name;
            } else if (full_file_name.endsWith(".pdf") || full_file_name.endsWith(".doc") || full_file_name.endsWith(".docx") || full_file_name.endsWith(".odt") || full_file_name.endsWith(".txt") || full_file_name.endsWith(".rtf") || full_file_name.endsWith(".md")) {
                file_name = '<i class="bi bi-file-earmark-text"></i> ' + file_name;
            } else if (full_file_name.endsWith(".svg")){
                file_name = '<i class="bi bi-filetype-svg"></i> ' + file_name;
            } else {
                file_name = '<i class="bi bi-file-earmark"></i> ' + file_name;
            }
            td.innerHTML = file_name;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = full_file_name;
            tr.appendChild(td);
            td = document.createElement('td');
            var a = document.createElement('a');
            a.href = project.Other_files[key];
            a.download = full_file_name;
            a.innerHTML = '<i class="bi bi-download"></i>';
            a.style = "text-decoration: none;text-align: center; display: block;";            td.appendChild(a);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        files.appendChild(table);
    });
}
document.addEventListener("DOMContentLoaded", function() {
    display_project();
});